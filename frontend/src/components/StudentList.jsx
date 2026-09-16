export default function StudentList({ students, loading, onEdit, onDelete }) {
  if (loading) {
    return <p className="status-message">Loading students...</p>
  }

  if (!students.length) {
    return <p className="status-message">No students found.</p>
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Year</th>
            <th>GPA</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.roll_no}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone || '-'}</td>
              <td>{s.course}</td>
              <td>{s.year}</td>
              <td>{s.gpa}</td>
              <td className="actions-cell">
                <button className="btn btn-small btn-edit" onClick={() => onEdit(s)}>
                  Edit
                </button>
                <button
                  className="btn btn-small btn-delete"
                  onClick={() => {
                    if (window.confirm(`Delete ${s.name} (${s.roll_no})? This cannot be undone.`)) {
                      onDelete(s.id)
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
