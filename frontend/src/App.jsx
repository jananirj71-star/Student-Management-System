import { useEffect, useState, useCallback } from 'react'
import StudentForm from './components/StudentForm.jsx'
import StudentList from './components/StudentList.jsx'
import { fetchStudents, createStudent, updateStudent, deleteStudent, extractErrorMessage } from './api.js'

export default function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingStudent, setEditingStudent] = useState(null)
  const [message, setMessage] = useState(null) // { type: 'success' | 'error', text }

  const loadStudents = useCallback(async (searchTerm = '') => {
    setLoading(true)
    try {
      const data = await fetchStudents({ search: searchTerm })
      setStudents(data)
    } catch (err) {
      setMessage({ type: 'error', text: extractErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  // Debounce search input
  useEffect(() => {
    const handle = setTimeout(() => loadStudents(search), 350)
    return () => clearTimeout(handle)
  }, [search, loadStudents])

  function showMessage(type, text) {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  async function handleCreateOrUpdate(payload) {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, payload)
        showMessage('success', 'Student updated successfully.')
      } else {
        await createStudent(payload)
        showMessage('success', 'Student added successfully.')
      }
      setEditingStudent(null)
      loadStudents(search)
    } catch (err) {
      showMessage('error', extractErrorMessage(err))
    }
  }

  async function handleDelete(id) {
    try {
      await deleteStudent(id)
      showMessage('success', 'Student deleted successfully.')
      loadStudents(search)
    } catch (err) {
      showMessage('error', extractErrorMessage(err))
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>Student Management System</h1>
        <p className="subtitle">React + Django REST Framework + SQLite</p>
      </header>

      {message && <div className={`banner banner-${message.type}`}>{message.text}</div>}

      <main>
        <section className="form-section">
          <StudentForm
            editingStudent={editingStudent}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => setEditingStudent(null)}
          />
        </section>

        <section className="list-section">
          <div className="list-header">
            <h2>Students</h2>
            <input
              type="text"
              placeholder="Search by name, roll no, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <StudentList
            students={students}
            loading={loading}
            onEdit={setEditingStudent}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  )
}
