import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import Comment from '../components/Comment'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useEffect } from 'react'
import useShowToast from '../hooks/useShowToast'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { DeleteIcon } from '@chakra-ui/icons'
import postsAtom from '../atoms/postsAtom'

const PostPage = () => {
  const { user, isLoading } = useGetUserProfile()
  const [posts, setPosts] = useRecoilState(postsAtom)
  const showToast = useShowToast()
  const { pid } = useParams()
  const currentUser = useRecoilValue(userAtom)
  const navigate = useNavigate()

  const currentPost = posts[0]

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`)

        const data = await res.json()

        if (data.error) {
          showToast("Error", data.error, "error")
          return
        }

        setPosts([data])
      } catch (err) {
        showToast("Error", err, "error")
      }
    }

    getPost()
  }, [showToast, pid, setPosts])

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) {
        return
      }

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      })

      const data = res.json()

      if (data.error) {
        showToast("Error", data.error, "error")
        return
      }

      showToast("Success", "Post deleted successfully.", "success")
      navigate(`/${user.username}`)
    } catch (err) {
      showToast("Error", err, "error")
    }
  }

  if (!user && isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    )
  }

  if (!currentPost) {
    return null
  }

  return (
    <>
      <Flex>
        <Flex w="full" alignItems={"center"} gap={3}>
          <Avatar src={user?.profilePicture} size={"md"} name={user?.name} />
          <Flex>
            <Text fontSize="sm" fontWeight="bold">{user?.username}</Text>
            <Image src="/verified.png" w={4} h={4} ml={0.5} mt={0.5} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems="center">
          <Text fontSize="xs" textAlign="right" w={36} color={"gray.light"}>{formatDistanceToNow(new Date(currentPost.createdAt))} ago</Text>
          {currentUser?._id === user?._id && (
            <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
          )}
          <BsThreeDots onClick={(e) => e.preventDefault()} />
        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>
      {currentPost.img && (
        <Box borderRadius={6} overflow="hidden" border={"1px solid"} borderColor={"gray.light"}>
        <Image src={currentPost.img} w={"full"} />
      </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentPost}/>
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize="2xl">🫰</Text>
          <Text color={"gray.light"}>Get the app to like, reply, and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies.map((reply) => (
        <Comment key={reply._id} reply={reply} isLastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id} />
      ))}
    </>
  )
}

export default PostPage