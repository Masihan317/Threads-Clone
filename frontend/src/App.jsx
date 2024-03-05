import { Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import UpdateProfilePage from "./pages/UpdateProfilePage"
import Header from "./components/Header"
import { useRecoilValue } from "recoil"
import userAtom from "./atoms/userAtom"
import LogOutButton from "./components/LogOutButton"

function App() {
  const user = useRecoilValue(userAtom)

  return (
    <Container maxW="620px">
      <Header />
      <Routes>
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
      </Routes>
      {user && <LogOutButton />}
    </Container>
  )
}

export default App
