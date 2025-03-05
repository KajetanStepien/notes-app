import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import NotesList from "./components/notes-list/NotesList";
import { deleteNote, Note } from "./components/note/Note";
import { createFolder } from "./components/folders-list/FoldersList";
import { createNewNote } from "./components/notes-list/NotesList";
import { updateNote } from "./components/note/Note";
import { NotFound } from "./components/not-found/NotFound";
import {
  deleteNoteFromArchive,
  restoreNoteFromArchive,
} from "./components/note/Note";
import { Login } from "./components/login/Login";
import { ProtectedRoute } from "./components/protected-route/ProtectedRoute";
import { fetchWithAuth } from "./utils/fetchWithAuth";

const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    path: "/",
    errorElement: <NotFound />,
    action: createFolder,
    loader: () => {
      return fetchWithAuth("http://localhost:3000/folders");
    },
    shouldRevalidate: ({ formAction }) => {
      if (formAction === "/") {
        return true;
      } else {
        return false;
      }
    },
    children: [
      {
        path: "notes/:folderId",
        element: (
          <ProtectedRoute>
            <NotesList />
          </ProtectedRoute>
        ),
        action: createNewNote,
        loader: ({ params }) => {
          return fetchWithAuth(
            `http://localhost:3000/notes?folderId=${params.folderId}`
          );
        },
        children: [
          {
            path: `note/:noteId`,
            element: <Note />,
            action: updateNote,
            errorElement: <NotFound />,
            loader: async ({ params }) => {
              const result = await fetchWithAuth(
                `http://localhost:3000/notes/${params.noteId}`
              );
              if (result.status === 404) {
                throw new Error();
              } else {
                return result.json();
              }
            },
            shouldRevalidate: ({ formAction }) => {
              if (formAction) {
                return false;
              } else {
                return true;
              }
            },
            children: [
              {
                path: "delete",
                action: deleteNote,
              },
            ],
          },
        ],
      },
      {
        path: "/archive",
        element: <NotesList />,
        loader: () => {
          return fetchWithAuth("http://localhost:3000/archive", {
            method: "GET",
          });
        },
        children: [
          {
            path: `:noteId`,
            element: <Note />,
            action: updateNote,
            errorElement: <NotFound />,
            loader: async ({ params }) => {
              const result = await fetchWithAuth(
                `http://localhost:3000/archive/${params.noteId}`
              );
              if (result.status === 404) {
                throw new Error();
              } else {
                return result.json();
              }
            },
            shouldRevalidate: ({ formAction }) => {
              if (formAction) {
                return false;
              } else {
                return true;
              }
            },
            children: [
              {
                path: "delete",
                action: deleteNoteFromArchive,
              },
              {
                path: "restore",
                action: restoreNoteFromArchive,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
