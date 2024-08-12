import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from 'react-icons/rx';
import { MdModeEdit } from 'react-icons/md';
import { RiDeleteBinLine } from "react-icons/ri";
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseDetailsAPI';
import toast from 'react-hot-toast';
import { setCourse } from '../../../../../slices/courseSlice';
import { BiSolidDownArrow } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import ConfirmationModal from '../../../../common/ConfirmationModal';
import SubSectionModal from './SubSectionModal';

function NestedView({handleChangeEditSectionName}) {

    const{course} = useSelector((state)=>state.course);
    const{token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();

    const[addSubSection,setAddSubSection] = useState(null);
    const[viewSubSection,setViewSubSection] = useState(null);
    const[editSubSection,setEditSubSection] = useState(null);

    const[confirmationModal,setConfirmationModal] = useState(null);

    const handleOnDeleteSection = async(sectionID) => {
        const result = await deleteSection({
            sectionID,
            courseID: course._id,
            token,
        });
        if(result){
            dispatch(setCourse(result));
        }
        setConfirmationModal(null);
    }

    const handleDeleteSubSection = async(subSectionID,sectionID) => {
        const data = {
            sectionId: sectionID,
            subSectionId: subSectionID,
            courseId: course._id
        }   
        const result = await deleteSubSection(data,token);
        if(result){
            dispatch(setCourse(result));
        }
        else{
            toast.error("subSection Not Deleted!");
        }
        setConfirmationModal(null);
    }

  return (
    <div>
        <div className=' mt-10 rounded-lg bg-richblack-700 p-6 px-8'>
            {
                course?.courseContent?.length > 0 && (
                    course?.courseContent?.map((section) => (
                        <details key={section._id} open>
                            <summary className='flex flex-col gap-x-3 border-b-2 pb-2 border-b-richblack-500 mb-4'> 
                                <div className='flex w-full items-center justify-between'>
                                    <div className='flex items-center gap-x-3'>
                                        <RxDropdownMenu />
                                        <p>{section.sectionName}</p>
                                    </div>
                                    <div className='flex items-center gap-x-3'>
                                        <button
                                            onClick={() => handleChangeEditSectionName(section._id,section.sectionName)}
                                        >
                                            <MdModeEdit />
                                        </button>
                                        <button
                                            onClick={() => (
                                                setConfirmationModal({
                                                    text1:"Delete this Section?",
                                                    text2:"All the lectures in this section will be deleted",
                                                    btn1Text:"Delete",
                                                    btn2Text:"Cancel",
                                                    btn1Handler: () => handleOnDeleteSection(section?._id),
                                                    btn2Handler: () => setConfirmationModal(null)
                                                })
                                            )}
                                        >
                                            <RiDeleteBinLine />
                                        </button>
                                        <span>|</span>
                                        <BiSolidDownArrow className='text-xl text-richblack-300' />
                                    </div>
                                </div>
                            </summary>
                            <div>
                                {
                                    section?.subSection?.length > 0 && (
                                        section.subSection.map((subSection) => (
                                            <div key={subSection._id} onClick={() => setViewSubSection(subSection)} className='flex items-center justify-between gap-x-3 border-b-2 pb-1 border-richblack-500 mb-2 pl-7 pr-1'>
                                                <div className='flex items-center gap-x-3'>
                                                    <RxDropdownMenu />
                                                    <p>{subSection.title}</p>
                                                </div>
                                                <div className='flex items-center gap-x-3' onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => setEditSubSection({ ...subSection,sectionId: section._id })}
                                                    >
                                                        <MdModeEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => (
                                                            setConfirmationModal({
                                                                text1:"Delete this Sub-Section?",
                                                                text2:"the lectures will be deleted",
                                                                btn1Text:"Delete",
                                                                btn2Text:"Cancel",
                                                                btn1Handler: () => handleDeleteSubSection(subSection._id,section._id),
                                                                btn2Handler: () => setConfirmationModal(null)
                                                            })
                                                        )}
                                                    >
                                                        <RiDeleteBinLine />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                                <button onClick={() => setAddSubSection(section._id)} className='mb-3 flex items-center gap-x-4 text-yellow-50 '>
                                    <FaPlus />
                                    <p>Add Lecture</p>
                                </button>
                            </div>
                        </details>  
                    )
                ))
            }
        </div>

        {
            addSubSection ? (<SubSectionModal modalData={addSubSection} setModalData={setAddSubSection} add={true}/>) 
            : viewSubSection ? (<SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view={true}/>) 
            : editSubSection ? (<SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true}/>) 
            : (<div></div>) 
        }
        {
            confirmationModal && (<ConfirmationModal modalData={confirmationModal} />) 
        }
    </div>
  )
}

export default NestedView;