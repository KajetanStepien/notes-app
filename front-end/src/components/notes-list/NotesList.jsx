import styles from "./NotesList.module.css";
import { Title } from "../title/Title";
import { AddNewButton } from "../add-new-button/AddNewButton";
import { TopBar } from "../top-bar/TopBar";
import { ShortNote } from "../short-note/ShortNote";
import { Note } from "../note/Note";
import {
  useLoaderData,
  NavLink,
  Outlet,
  Form,
  useLocation,
} from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

const url = "https://notes-app-ki1m.onrender.com";

export function createNewNote({ params }) {
  return fetchWithAuth(`${url}/notes`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      title: "New note",
      body: "Enter note content here.",
      folderId: Number(params.folderId),
    }),
  });
}

const NotesContainer = ({ children }) => (
  <div className={styles["notes-container"]}>{children}</div>
);

const Notes = ({ children }) => (
  <div className={styles["notes-list"]} role="list">
    {children}
  </div>
);

const NotesList = () => {
  const notes = useLoaderData();
  const location = useLocation();

  return (
    <NotesContainer>
      <Notes>
        <TopBar>
          <Title>Notes</Title>
          <Form method="POST">
            <AddNewButton>+</AddNewButton>
          </Form>
        </TopBar>

        {notes.map((note) => (
          <NavLink
            key={note.id}
            to={
              location.pathname === "/archive"
                ? `/archive/${note.id}`
                : `/notes/${note.folderId}/note/${note.id}`
            }
          >
            {({ isActive }) => (
              <ShortNote
                active={isActive}
                role="listitem"
                note={note}
              ></ShortNote>
            )}
          </NavLink>
        ))}
      </Notes>
      <Outlet />
    </NotesContainer>
  );
};

export default NotesList;
