import { Outlet, useNavigation } from "react-router-dom";
import FoldersList from "./components/folders-list/FoldersList";
import Layout from "./components/layout/Layout";
import { Loader } from "./components/loader/Loader";
export function App() {
  const { state, formMethod } = useNavigation();
  console.log(formMethod);
  return (
    <Layout>
      {(state === "loading" || state === "submitting") &&
        formMethod !== "post" && <Loader />}
      <FoldersList />
      <Outlet />
    </Layout>
  );
}
