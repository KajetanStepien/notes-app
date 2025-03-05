import styles from "./FoldersList.module.css";
import { Folder } from "../folder/Folder";
import { Title } from "../title/Title";
import { TopBar } from "../top-bar/TopBar";
import { AddNewButton } from "../add-new-button/AddNewButton";
import { Logout } from "../../logout/Logout";
import { NavLink, useLoaderData, Form, redirect } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

export async function createFolder(args) {
  const data = await args.request.formData();
  const folderName = data.get("folder-name");

  return fetchWithAuth(`http://localhost:3000/folders`, {
    method: "POST",
    body: JSON.stringify({
      name: folderName,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((newFolder) => {
      return redirect(`/notes/${newFolder.id}`);
    });
}

const Folders = ({ children }) => (
  <div className={styles["folders-column"]}>{children}</div>
);
const UserCreatedFolders = ({ children }) => (
  <div role="list" className={styles["folders-list"]}>
    {children}
  </div>
);

const FoldersList = () => {
  const folders = useLoaderData();

  return (
    <Folders>
      <TopBar>
        <Form method="POST" action="/">
          <input
            className={styles["new-folder-input"]}
            type="text"
            placeholder="Folder name"
            name="folder-name"
          />
          <AddNewButton type="submit">+</AddNewButton>
        </Form>
      </TopBar>

      <Title>Folders</Title>
      <UserCreatedFolders>
        {folders.map((folder) => (
          <NavLink key={folder.id} to={`/notes/${folder.id}`}>
            {({ isActive }) => {
              return <Folder active={isActive}>{folder.name}</Folder>;
            }}
          </NavLink>
        ))}
      </UserCreatedFolders>
      <Logout />
      <NavLink to="/archive">
        <Folder>Archive</Folder>
      </NavLink>
    </Folders>
  );
};

export default FoldersList;
