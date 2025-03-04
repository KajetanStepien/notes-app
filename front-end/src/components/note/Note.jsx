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

const NoteEditor = ({ children }) => (
  <div className={styles["note-editor"]}>{children}</div>
);

export async function deleteNote({ params, request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const folderId = formData.get("folderId");

  await fetch(`http://localhost:3000/notes/${params.noteId}`, {
    method: "DELETE",
  });

  return fetch("http://localhost:3000/archive", {
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

  return fetch(`http://localhost:3000/notes/${params.noteId}`, {
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
  return fetch(`http://localhost:3000/archive/${params.noteId}`, {
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

  await fetch(`http://localhost:3000/archive/${params.noteId}`, {
    method: "DELETE",
  });

  return fetch(`http://localhost:3000/notes/`, {
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
      <button className={styles.button}>
        <img className={styles.image} src="/src/assets/restore.svg" />
      </button>
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
          <button
            className={`${styles.button} ${
              resolved.pathname.includes("archive") ? styles["align-right"] : ""
            }`}
          >
            <img className={styles.image} src={RemoveIcon} />
          </button>
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
