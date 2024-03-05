import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, Avatar, Center } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import usePreviewImage from "../hooks/usePreviewImage";

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom)
  const fileRef = useRef(null)
  const { imageURL, handleImageChange } = usePreviewImage()
  const showToast = useShowToast()

  const [input, setInput] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({...input, profilePicture: imageURL})
      })

      const data = await res.json()

      if (data.error) {
        showToast("Error", data.error, "error")
        return
      }
      showToast("Success", "Profile updated successfully.", "success")
      setUser(data)
      localStorage.setItem("user-threads", JSON.stringify(data))
    } catch (err) {
      showToast("Error", err, "error")
    }
  }

	return (
		<form onSubmit={handleSubmit}>
			<Flex align={"center"} justify={"center"} my={6}>
				<Stack spacing={4} w={"full"} maxW={"md"} bg={useColorModeValue("white", "gray.dark")} rounded={"xl"} boxShadow={"lg"} p={6}>
					<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
						User Profile Edit
					</Heading>
					<FormControl id='userName'>
						<Stack direction={["column", "row"]} spacing={6}>
							<Center>
								<Avatar size='xl' boxShadow={"md"} src={imageURL || user.profilePicture} />
							</Center>
							<Center w="full">
								<Button w='full' onClick={() => fileRef.current.click()}>Change Avatar</Button>
								<Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
							</Center>
						</Stack>
					</FormControl>
					<FormControl>
						<FormLabel>Full name</FormLabel>
						<Input type='text' placeholder="John Doe" _placeholder={{ color: "gray.500" }} value={input.name} onChange={(e) => setInput({...input, name: e.target.value})} />
					</FormControl>
					<FormControl>
						<FormLabel>User name</FormLabel>
						<Input type='text' placeholder="johndoe" _placeholder={{ color: "gray.500" }} value={input.username} onChange={(e) => setInput({...input, username: e.target.value})} />
					</FormControl>
					<FormControl>
						<FormLabel>Email address</FormLabel>
						<Input type='email' placeholder="johndoe@gmail.com" _placeholder={{ color: "gray.500" }} value={input.email} onChange={(e) => setInput({...input, email: e.target.value})} />
					</FormControl>
					<FormControl>
						<FormLabel>Bio</FormLabel>
						<Input type='text' placeholder="Just a rando on the internet." _placeholder={{ color: "gray.500" }} value={input.bio} onChange={(e) => setInput({...input, bio: e.target.value})} />
					</FormControl>
					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input type='password' placeholder="********" _placeholder={{ color: "gray.500" }} value={input.password} onChange={(e) => setInput({...input, password: e.target.value})} />
					</FormControl>
					<Stack spacing={6} direction={["column", "row"]}>
						<Button bg={"red.400"} color={"white"} w='full' _hover={{ bg: "red.500" }}>
							Cancel
						</Button>
						<Button bg={"blue.400"} color={"white"} w='full' _hover={{ bg: "blue.500" }} type='submit'>
							Submit
						</Button>
					</Stack>
				</Stack>
			</Flex>
		</form>
	);
}