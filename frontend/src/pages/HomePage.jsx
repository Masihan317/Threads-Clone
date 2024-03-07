import { useState, useEffect } from "react"
import useShowToast from "../hooks/useShowToast"
import { Flex, Spinner } from "@chakra-ui/react"
import Post from "../components/Post"
import { useRecoilState } from "recoil"
import postsAtom from "../atoms/postsAtom"

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [isLoading, setIsLoading] = useState(true)
  const showToast = useShowToast()

  useEffect(() => {
    const getFeedPosts = async () => {
      try {
        const res = await fetch("api/posts/feed")
        const data = await res.json()

        if (data.error) {
          showToast("Error", data.error, "error")
          return
        }

        setPosts(data)
      } catch (err) {
        showToast("Error", err, "error")
      } finally {
        setIsLoading(false)
      }
    }

    getFeedPosts()
  }, [showToast, setPosts])

  return (
    <>
      {!isLoading && posts.length === 0 && (
        <h1>Follow some users to see the feed {"<"}3</h1>
      )}
      {isLoading && (
        <Flex justifyContent={"center"}>
          <Spinner size="xl" />
        </Flex>
      )}
      {posts.map((post) => (<Post key={post._id} post={post} postedBy={post.postedBy} />))}
    </>
  )
}

export default HomePage