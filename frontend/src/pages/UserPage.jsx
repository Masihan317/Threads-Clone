import { useState, useEffect } from "react"
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom"
import useShowToast from "../hooks/useShowToast"
import { Flex, Spinner, Text } from "@chakra-ui/react"
import Post from "../components/Post"
import useGetUserProfile from '../hooks/useGetUserProfile'

const UserPage = () => {
  const { user, isLoading } = useGetUserProfile()
  const [posts, setPosts] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  const { username } = useParams()
  const showToast = useShowToast()

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch(`/api/posts/user/${username}`)
        const data = await res.json()

        if (data.error) {
          showToast("Error", data.error, "error")
          return
        }
        setPosts(data)
      } catch (err) {
        showToast("Error", err, "error")
        setPosts([])
      } finally {
        setIsFetching(false)
      }
    }

    getPosts()
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
      {!isFetching && posts.length === 0 && <Text mt={4}>User has no posts.</Text>}
      {isFetching && (
        <Flex justifyContent={"center"}>
          <Spinner my={12} size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  )
}

export default UserPage