import Link from 'next/link'
import {HiPencilAlt} from 'react-icons/hi'

export default function profileList() {
  return (
    <>
        <div className="p-4 border border-slate-300 my-3 flex justify-between gap-5 item-start">
            <div>
                <h1 className='font-bold text-l'>Name :</h1>
                <div>
                    description
                </div>
                <h1 className='font-bold text-l'>Email :</h1>
                <div>
                    description
                </div>
                <h1 className='font-bold text-l'>Phone Number :</h1>
                <div>
                    description
                </div>
                <h1 className='font-bold text-l'>Vehicle Number :</h1>
                <div>
                    description
                </div>
                    <h1 className='font-bold text-l'>Bank Details :</h1>
                <div>
                    description
                </div>       
                <h1 className='font-bold text-l'>Address :</h1>
                <div>
                    description
                </div>        
            </div>
            <div>
                <Link href={'/users_dashboard/editTopic/123'}>
                    <HiPencilAlt size={24} />
                </Link>
            </div>
        </div>
    </>
    
  )
}

