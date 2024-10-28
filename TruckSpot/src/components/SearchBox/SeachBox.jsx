import React from 'react'



function SeachBox() {
  return (
    <div className='container mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 py-6'>
    <h1 className="text-xl font-bold whitespace-nowrap">Upcoming Events</h1>
    <div className="w-full max-w-md">
        <input 
            type="text" 
            placeholder="Search for an event" 
            className="input input-bordered w-full" 
        />
    </div>
</div>
    
  )
}

export default SeachBox