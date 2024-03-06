import { AddIcon } from "@chakra-ui/icons"
import { Button, useColorModeValue, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, Text, Textarea, Input, Flex, Image, CloseButton } from "@chakra-ui/react"
import { useRef, useState } from "react"
import usePreviewImage from "../hooks/usePreviewImage"
import { BsFillImageFill } from "react-icons/bs"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import useShowToast from "../hooks/useShowToast"

const MAX_CHAR = 500

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [postText, setPostText] = useState("")
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR)
  const imageRef = useRef(null)
  const { imageURL, handleImageChange, setImageURL } = usePreviewImage()
  const user = useRecoilValue(userAtom)
  const showToast = useShowToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleTextChange = (e) => {
    const input = e.target.value

    if (input.length > MAX_CHAR) {
      const truncatedText = input.slice(0, MAX_CHAR)
      setPostText(truncatedText)
      setRemainingChar(0)
    } else {
      setPostText(input)
      setRemainingChar(MAX_CHAR - input.length)
    }
  }

  const handleCreatePost = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imageURL
        })
      })

      const data = await res.json()

      if (data.error) {
        showToast("Error", data.error, "error")
        return
      }
      showToast("Success", "Post created successfully.","success")
      onClose()
      setPostText("")
      setImageURL("")
    } catch {
      showToast("Error", err, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon = {<AddIcon />}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
      >
        Post
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea placeholder="Post Body..." value={postText} onChange={handleTextChange} />
              <Text fontSize="xs" fontWeight="bold" textAlign={"right"} m={1} color={"gray.800"}>{remainingChar}/{MAX_CHAR}</Text>
              <Input type="file" ref={imageRef} onChange={handleImageChange} hidden />
              <BsFillImageFill ml={5} cursor={"pointer"} size={16} onClick={() => imageRef.current.click()} />
            </FormControl>
            {imageURL && (
              <Flex mt={5} w="full" position={"relative"}>
                <Image src={imageURL} alt="Selected Image" />
                <CloseButton onClick={() => { setImageURL("") }} bg={"gray.800"} position={"absolute"} top={2} right={2} />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={isLoading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost