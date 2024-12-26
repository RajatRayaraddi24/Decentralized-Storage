import React from 'react'

function Loader() {
    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-black opacity-70 flex flex-col items-center justify-center'>
            <div class="loader">
                <div class="box box-1">
                    <div class="side-left"></div>
                    <div class="side-right"></div>
                    <div class="side-top"></div>
                </div>
                <div class="box box-2">
                    <div class="side-left"></div>
                    <div class="side-right"></div>
                    <div class="side-top"></div>
                </div>
                <div class="box box-3">
                    <div class="side-left"></div>
                    <div class="side-right"></div>
                    <div class="side-top"></div>
                </div>
                <div class="box box-4">
                    <div class="side-left"></div>
                    <div class="side-right"></div>
                    <div class="side-top"></div>
                </div>
            </div>
        </div>
    )
}

export default Loader