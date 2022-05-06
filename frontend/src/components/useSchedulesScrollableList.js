import React, {useState, useEffect} from 'react'

export default function useSchedulesScrollableList() {
    const [schedulesList, setSchedulesList] = useState(null)
    return {
        schedulesList,
        setSchedulesList,
    }   
}
