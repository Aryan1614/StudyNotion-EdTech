import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import toast from "react-hot-toast"
import { deleteProfile } from "../../../../services/operations/settingsAPI"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const[isChecked,setIsChecked] = useState(false);

  async function handleDeleteAccount() {
    try {
      if(!isChecked){
        toast.error("Check the box To Continue!");
        return;
      }
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <>
      <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
        <div className="flex aspect-square h-14 w-14 items-center cursor-pointer justify-center rounded-full bg-pink-700" onClick={handleDeleteAccount}>
          <FiTrash2  className="text-3xl text-pink-200" />
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-richblack-5">
            Delete Account
          </h2>
          <div className="w-3/5 text-pink-25">
            <p>Would you like to delete account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the contain associated with it.
            </p>
          </div>
          <button
            type="button"
            className="w-fit italic text-pink-300 flex items-center gap-x-1"
          >
            <input type="checkbox" checked={isChecked} className="cursor-pointer" onChange={() => setIsChecked(!isChecked)} name="checkbox" id="checkbox" />
            <p>I want to delete my account.</p>
          </button>
        </div>
      </div>
    </>
  )
}
