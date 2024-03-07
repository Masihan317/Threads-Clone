import { Button } from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import { FiLogOut } from 'react-icons/fi'

const LogOutButton = () => {
  const setUser = useSetRecoilState(userAtom)
  const showToast = useShowToast()

  const handleLogOut = async () => {
    try {
      
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await res.json()

      if (data.error) {
        showToast("Error", data.error, "error")
        return
      }

      localStorage.removeItem("user-threads")
      setUser(null)
    } catch (err) {
      showToast("Error", err, "error")
    }
  }

  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      onClick={handleLogOut}
    >
      <FiLogOut size={20} />
    </Button>
  )
}

export default LogOutButton