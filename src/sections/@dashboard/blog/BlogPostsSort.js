import PropTypes from 'prop-types';
// @mui
import {MenuItem, TextField} from '@mui/material';
import {useState} from "react";

// ----------------------------------------------------------------------

BlogPostsSort.propTypes = {
    options: PropTypes.array,
    onSort: PropTypes.func,
    value: PropTypes.string
};

export let pieChartSelect;
pieChartSelect = 'popcorn';
export let pieChartDataUpdated;
pieChartDataUpdated = []



export default function BlogPostsSort({options, onSort, value}) {
    const [pieChartSelection, setPieChartSelection] = useState(value);

    const getPieChartData = async (snack) => {
        console.log("Snack: ",snack);
        await fetch("http://127.0.0.1:8000/snack/piechart/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({snack: snack})

        }).then((res) => {
            res.json().then((data) => {
                pieChartDataUpdated = data;
            })
        });


    }

    return (
        <TextField select size="small" value={pieChartSelection} onChange={(event) => {
            setPieChartSelection(event.target.value)
            pieChartSelect = event.target.value
            console.log(pieChartSelect);
            getPieChartData(event.target.value);

        }}>
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
}
