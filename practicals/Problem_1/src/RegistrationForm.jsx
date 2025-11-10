import React from 'react'

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm: '',
      gender: 'male',
      country: '',
      accept: false,
      errors: {},
      submittedData: null,
    }
  }

  handleChange = (e) => {
    const { name, type, value, checked } = e.target
    this.setState({ [name]: type === 'checkbox' ? checked : value })
  }

  validate = () => {
    const errors = {}
    const { firstName, lastName, email, password, confirm, accept } = this.state
    if (!firstName.trim()) errors.firstName = 'First name is required'
    if (!lastName.trim()) errors.lastName = 'Last name is required'
    if (!email.trim()) errors.email = 'Email is required'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = 'Email is invalid'
    if (!password) errors.password = 'Password is required'
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
    if (password !== confirm) errors.confirm = 'Passwords do not match'
    if (!accept) errors.accept = 'You must accept the terms'
    return errors
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const errors = this.validate()
    if (Object.keys(errors).length > 0) {
      this.setState({ errors })
      return
    }

    const { firstName, lastName, email, gender, country } = this.state
    const data = { firstName, lastName, email, gender, country }
    this.setState({ submittedData: data, errors: {} })
  }

  render() {
    const { firstName, lastName, email, password, confirm, gender, country, accept, errors, submittedData } = this.state

    return (
      <div className="registration-form" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'left' }}>
        <form onSubmit={this.handleSubmit} noValidate>
          <div>
            <label>First name</label>
            <input name="firstName" value={firstName} onChange={this.handleChange} />
            {errors.firstName && <div className="error">{errors.firstName}</div>}
          </div>

          <div>
            <label>Last name</label>
            <input name="lastName" value={lastName} onChange={this.handleChange} />
            {errors.lastName && <div className="error">{errors.lastName}</div>}
          </div>

          <div>
            <label>Email</label>
            <input name="email" type="email" value={email} onChange={this.handleChange} />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div>
            <label>Password</label>
            <input name="password" type="password" value={password} onChange={this.handleChange} />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>

          <div>
            <label>Confirm Password</label>
            <input name="confirm" type="password" value={confirm} onChange={this.handleChange} />
            {errors.confirm && <div className="error">{errors.confirm}</div>}
          </div>

          <div>
            <label>Gender</label>
            <div>
              <label>
                <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={this.handleChange} /> Male
              </label>
              <label style={{ marginLeft: 8 }}>
                <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={this.handleChange} /> Female
              </label>
            </div>
          </div>

          <div>
            <label>Country</label>
            <select name="country" value={country} onChange={this.handleChange}>
              <option value="">Select country</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
          </div>

          <div>
            <label>
              <input type="checkbox" name="accept" checked={accept} onChange={this.handleChange} /> I accept the terms
            </label>
            {errors.accept && <div className="error">{errors.accept}</div>}
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="submit">Register</button>
          </div>
        </form>

        {submittedData && (
          <div className="submitted" style={{ marginTop: 16 }}>
            <h3>Submitted data</h3>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          </div>
        )}
      </div>
    )
  }
}

export default RegistrationForm
