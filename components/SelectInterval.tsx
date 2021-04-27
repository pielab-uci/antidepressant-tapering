import * as React from 'react';

const SelectInterval = () => {
  return (
    <>
      <div>Select Interval</div>
      <div>interval:</div>
      <input type="number" />
      <select>
        <option value="Days">Days</option>
        <option value="Days">Weeks</option>
        <option value="Months">Months</option>
      </select>
      <div>End on</div>
      <div>Calendar</div>
    </>
  )
}

export default SelectInterval;
