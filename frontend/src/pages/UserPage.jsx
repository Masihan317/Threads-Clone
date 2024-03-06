import { useState, useEffect } from "react"
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useParams } from "react-router-dom"
import useShowToast from "../hooks/useShowToast"
import { Flex, Spinner } from "@chakra-ui/react"

const UserPage = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { username } = useParams()
  const showToast = useShowToast()

  useEffect(() => {
    const getUser = async() => {
      try {
        const res = await fetch(`/api/users/profile/${username}`)
        const data = await res.json()

        if (data.error) {
          showToast("Error", data.error, "error")
          return
        }
        setUser(data)
      } catch (err) {
        showToast("Error", err, "error")
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [username, showToast])

  if (!user && isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    )
  }

  if (!user && !isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <h1>User not found.</h1>
      </Flex>
    )
  }

  return (
    <>
      <UserHeader user={user} />
      <UserPost likes={1200} replies={123} image="/post1.png" title={"Let's talk about threads."} />
      <UserPost likes={7800} replies={623} image="/post2.png" title={"Lorem Ipsum."} />
      <UserPost likes={900} replies={423} image="/post3.png" title={"Test Test."} />
      <UserPost likes={9} replies={7} image="/post4.png" title={"Tutorial."} />
    </>
  )
}

export default UserPage