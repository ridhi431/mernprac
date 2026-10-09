import {Outlet} from 'react-router-dom'

const Authlayout = ()=>{
    return(
    <div flex-item-center justify-center min-h-screen bg-base-200>
    <Outlet />
    </div>
    );
}

export default Authlayout;