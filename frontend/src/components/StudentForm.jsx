import { useEffect, useState } from 'react'

const COURSE_OPTIONS = [
  { value: 'CSE', label: 'Computer Science & Engineering' },
  { value: 'ECE', label: 'Electronics & Communication Engineering' },
  { value: 'MECH', label: 'Mechanical Engineering' },
  { value: 'CIVIL', label: 'Civil Engineering' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'OTHER', label: 'Other' },
]

const EMPTY_FORM = {
  roll_no: '',
  name: '',
  email: '',
  phone: '',
  course: 'CSE',
  year: 1,
  gpa: '',
}

export default function StudentForm({ editingStudent, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingStudent) {
      setForm({ ...EMPTY_FORM, ...editingStudent })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [editingStudent])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    const errs = {}
    if (!form.roll_no.trim()) errs.roll_no = 'Roll number is required.'
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!form.email.trim()) {
      errs.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address.'
    }
    if (form.phone && !/^\+?\d{7,15}$/.test(form.phone)) {
      errs.phone = 'Enter a valid phone number (7-15 digits).'
    }
    const yearNum = Number(form.year)
    if (!yearNum || yearNum < 1 || yearNum > 5) {
      errs.year = 'Year must be between 1 and 5.'
    }
    const gpaNum = Number(form.gpa)
    if (form.gpa === '' || isNaN(gpaNum) || gpaNum < 0 || gpaNum > 10) {
      errs.gpa = 'GPA must be between 0 and 10.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      year: Number(form.year),
      gpa: Number(form.gpa),
    })
  }

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>

      <div className="form-row">
        <label htmlFor="roll_no">Roll Number *</label>
        <input
          id="roll_no"
          name="roll_no"
          value={form.roll_no}
          onChange={handleChange}
          disabled={Boolean(editingStudent)}
        />
        {errors.roll_no && <span className="field-error">{errors.roll_no}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="name">Full Name *</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="email">Email *</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
        {errors.phone && <span className="field-error">{errors.phone}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="course">Course</label>
        <select id="course" name="course" value={form.course} onChange={handleChange}>
          {COURSE_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="year">Year *</label>
        <input id="year" name="year" type="number" min="1" max="5" value={form.year} onChange={handleChange} />
        {errors.year && <span className="field-error">{errors.year}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="gpa">GPA *</label>
        <input id="gpa" name="gpa" type="number" step="0.01" min="0" max="10" value={form.gpa} onChange={handleChange} />
        {errors.gpa && <span className="field-error">{errors.gpa}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingStudent ? 'Update Student' : 'Add Student'}
        </button>
        {editingStudent && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
