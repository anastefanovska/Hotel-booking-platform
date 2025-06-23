import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DateSlider = ({ onDateChange }) => {
	const [range, setRange] = useState([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: "selection"
		}
	]);

	const handleSelect = (ranges) => {
		const { startDate, endDate } = ranges.selection;
		setRange([ranges.selection]);
		onDateChange(startDate, endDate); // callback to parent
	};

	const handleClear = () => {
		onDateChange(null, null);
	};

	return (
		<div>
			<h5>Filter bookings by date</h5>
			<DateRangePicker ranges={range} onChange={handleSelect} />
			<button className="btn btn-secondary mt-2" onClick={handleClear}>
				Clear Filter
			</button>
		</div>
	);
};

export default DateSlider;
