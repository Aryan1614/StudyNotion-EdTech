import React, { useState } from 'react'
import { Chart,registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(...registerables);

function InstructorChart({courses}) {

    const[currChart,setCurrChart] = useState("Students");

    const RandomColorsGenrator = (numColors) => {
        let colors = [];
        for(let i=0;i<numColors;i++){
            const color=`rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
            colors.push(color);
        }
        return colors;       
    }

    //create data for chart displaying student info
    const chartDataForStudents = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.studentsEnrolled.length),
                backgroundColor: RandomColorsGenrator(courses.length)
            }
        ]
    }
    //create data for chart displauing incodme info
    const chartDataForIncome = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => (course.price*(course.studentsEnrolled.length))),
                backgroundColor: RandomColorsGenrator(courses.length),
            }
        ]
    }

    const options = {
        maintainAspectRatio: false,
    }

  return (
    <div className='flex flex-col gap-y-2 bg-richblue-800 rounded-md w-[74%] p-6'>
      <p className='text-richblack-25 font-semibold text-xl'>Visualize</p>
      <div className='flex items-center gap-x-3 mt-2'>
        <button onClick={() => setCurrChart("Students")} className={`bg-richblack-700 font-semibold px-2 py-1 rounded-sm ${currChart === "Students" ? "text-yellow-50" : "text-yellow-200"}`}>
            Student
        </button>
        <button onClick={() => setCurrChart("Income")} className={`bg-richblack-700 font-semibold px-2 py-1 rounded-sm ${currChart === "Income" ? "text-yellow-50" : "text-yellow-200"}`}>
            Income
        </button>
      </div>
      <div className='mt-4 relative mx-auto aspect-square h-[400px]'>
        <Pie 
            data={currChart === "Students" ? chartDataForStudents : chartDataForIncome }
            options={options}
        />
      </div>
    </div>
  )
}

export default InstructorChart
