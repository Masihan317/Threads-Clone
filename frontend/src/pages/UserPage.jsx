import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost likes={1200} replies={123} image="/post1.png" title={"Let's talk about threads."} />
      <UserPost likes={7800} replies={623} image="/post2.png" title={"Lorem Ipsum."} />
      <UserPost likes={900} replies={423} image="/post3.png" title={"Test Test."} />
      <UserPost likes={9} replies={7} image="/post4.png" title={"Tutorial."} />
    </>
  )
}

export default UserPage