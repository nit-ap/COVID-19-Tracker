import React from 'react';
import './InfoBox.css';  
import {Card,CardContent,Typography} from '@material-ui/core';

function InfoBox({title,isRed,active,cases,total,...props}) {
    return (
         <Card 
         onClick={props.onClick} 
         className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`} 
         
         >
         <CardContent>
         <Typography className='infobox_title'color='textSecondary'>{title}</Typography>

         <h2 className={`infoBox_cases ${!isRed && "infoBox_cases--green"}`}>{cases}</h2>

         <Typography classname='infoBox_total'color='textSecondary'>{total} Total</Typography>

         </CardContent>
         </Card>
    )
}

export default InfoBox
