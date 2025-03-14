import RemoveIcon from "../../assets/remove.svg";
import styles from "./Note.module.css";
import { TopBar } from "../top-bar/TopBar";
import {
  useLoaderData,
  Form,
  useSubmit,
  redirect,
  useResolvedPath,
} from "react-router-dom";
import { useCallback } from "react";
import { debounce } from "../../utils/debounce";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import { Icon } from "@mui/material";

const url = "https://notes-app-ki1m.onrender.com";

const NoteEditor = ({ children }) => (
  <div className={styles["note-editor"]}>{children}</div>
);

export async function deleteNote({ params, request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const folderId = formData.get("folderId");

  await fetchWithAuth(`${url}/notes/${params.noteId}`, {
    method: "DELETE",
  });

  return fetchWithAuth(`${url}/archive`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      body,
      folderId,
    }),
  }).then(() => {
    return redirect(`/notes/${params.folderId}`);
  });
}

export async function updateNote({ request, params }) {
  const data = await request.formData();

  const title = data.get("title");
  const body = data.get("body");

  return fetchWithAuth(`${url}/notes/${params.noteId}`, {
    method: "PATCH",
    body: JSON.stringify({
      title,
      body,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function deleteNoteFromArchive({ params }) {
  return fetchWithAuth(`${url}/archive/${params.noteId}`, {
    method: "DELETE",
  }).then(() => {
    return redirect(`/archive`);
  });
}

export async function restoreNoteFromArchive({ request, params }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const folderId = formData.get("folderId");

  await fetchWithAuth(`${url}/archive/${params.noteId}`, {
    method: "DELETE",
  });

  return fetchWithAuth(`${url}/notes/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      title,
      body,
      folderId,
    }),
  }).then(() => {
    return redirect(`/notes/${folderId}`);
  });
}

const Note = () => {
  const note = useLoaderData();
  const submit = useSubmit();

  const resolved = useResolvedPath();

  const onChangeCallback = useCallback(
    debounce((event) => {
      const form = event.target.closest("form");
      submit(form, { method: "PATCH" });
    }, 300),
    [debounce, submit]
  );

  const restoreForm = (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", note.title);
        formData.append("body", note.body);
        formData.append("folderId", note.folderId);

        submit(formData, {
          method: "POST",
          action: "restore",
        });
      }}
    >
      <IconButton size="small" type="submit" aria-label="restore">
        <ReplayIcon />
      </IconButton>
    </Form>
  );

  return (
    <div className={styles.container}>
      <TopBar>
        {resolved.pathname.includes("archive") && restoreForm}
        <Form
          method="DELETE"
          action="delete"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("title", note.title);
            formData.append("body", note.body);
            formData.append("folderId", note.folderId);

            submit(formData, {
              method: "DELETE",
              action: "delete",
            });
          }}
        >
          <IconButton
            type="submit"
            size="small"
            aria-label="delete"
            className={`${styles.button} ${
              resolved.pathname.includes("archive") ? styles["align-right"] : ""
            }`}
          >
            <DeleteIcon />
          </IconButton>
        </Form>
      </TopBar>
      <Form method="PATCH" onChange={onChangeCallback}>
        <NoteEditor key={note.id}>
          <input type="text" defaultValue={note.title} name="title" />
          <textarea defaultValue={note.body} name="body" />
        </NoteEditor>
      </Form>
    </div>
  );
};

export { Note };
