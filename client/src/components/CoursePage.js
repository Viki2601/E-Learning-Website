import React from 'react';
import { Link } from 'react-router-dom';

export default function CoursePage(props) {
    return (
        <div className='flex flex-col font-sans'>
            <a className='flex relative h-48 justify-center rounded overflow-hidden'>
                <img className='object-cover w-full h-full block' src={props.img[0]} alt={`${props.name}`} />
            </a>
            <div className='mt-4 mb-4 flex flex-col'>
                <h3 className='text-gray-500 text-xs font-bold tracking-widest mb-1'>Type: {props.type}</h3>
                <h3 className='text-gray-900 tracking-widest mb-1 text-lg font-semibold'>{props.name}</h3>
                <p className='mt-1 font-semibold'>Language: {props.language}</p>
                <p className='mt-1 font-semibold'>Creator: {props.creator}</p>
            </div>
            <div className='flex justify-between'>
                <h3 className='text-gray-900 tracking-widest text-lg font-semibold'>Price: ₹{props.price}.00</h3>
                <Link to={`/singleViewPage/${props._id}`} className=' text-gray-300 bg-gray-900 border-0 py-2 px-5 rounded-lg hover:border-gray-600'>Details</Link>
            </div>
        </div>
    );
}
