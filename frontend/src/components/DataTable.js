import React from "react";

const DataTable = ({ jobs }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Company</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job, index) => (
          <tr key={index}>
            <td data-cell="Title">
              <a rel="noreferrer" target="_blank" href={job.link}>
                {job.title}
              </a>
            </td>
            <td data-cell="Company">{job.company}</td>
            <td data-cell="Location">{job.location.replace("•", " - ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
