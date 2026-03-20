import {useCallback, useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Jobs = () => {
  const [profileData, setProfileData] = useState(null)
  const [profileStatus, setProfileStatus] = useState(apiStatus.initial)
  const [jobsData, setJobsData] = useState([])
  const [jobsStatus, setJobsStatus] = useState(apiStatus.initial)
  const [searchInput, setSearchInput] = useState('')
  const [employmentTypes, setEmploymentTypes] = useState([])
  const [salaryRange, setSalaryRange] = useState('')

  const getProfileData = useCallback(async () => {
    setProfileStatus(apiStatus.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const response = await fetch('https://apis.ccbp.in/profile', {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })
    const data = await response.json()

    if (response.ok) {
      setProfileData(data.profile_details)
      setProfileStatus(apiStatus.success)
    } else {
      setProfileStatus(apiStatus.failure)
    }
  }, [])

  const getJobsData = useCallback(async () => {
    setJobsStatus(apiStatus.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const employmentTypeQuery = employmentTypes.join(',')

    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeQuery}&minimum_package=${salaryRange}&search=${searchInput}`
    const response = await fetch(jobsApiUrl, {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })
    const data = await response.json()

    if (response.ok) {
      const formattedJobsData = data.jobs.map(eachJob => ({
        id: eachJob.id,
        title: eachJob.title,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
      }))

      setJobsData(formattedJobsData)
      setJobsStatus(apiStatus.success)
    } else {
      setJobsStatus(apiStatus.failure)
    }
  }, [employmentTypes, salaryRange, searchInput])

  useEffect(() => {
    getProfileData()
  }, [getProfileData])

  useEffect(() => {
    getJobsData()
  }, [getJobsData])

  const onChangeEmploymentType = id => {
    setEmploymentTypes(prevState => {
      if (prevState.includes(id)) {
        return prevState.filter(eachId => eachId !== id)
      }
      return [...prevState, id]
    })
  }

  const onChangeSalaryRange = id => {
    setSalaryRange(id)
  }

  const renderProfileSection = () => {
    switch (profileStatus) {
      case apiStatus.inProgress:
        return <p className="loader-text">Loading profile...</p>
      case apiStatus.success:
        return (
          <div className="profile-card">
            <img
              src={profileData.profile_image_url}
              alt="profile"
              className="profile-image"
            />
            <h1 className="profile-name">{profileData.name}</h1>
            <p className="profile-bio">{profileData.short_bio}</p>
          </div>
        )
      case apiStatus.failure:
        return (
          <div className="retry-wrapper">
            <button type="button" className="retry-btn" onClick={getProfileData}>
              Retry
            </button>
          </div>
        )
      default:
        return null
    }
  }

  const renderJobsList = () => {
    if (jobsData.length === 0) {
      return (
        <div className="empty-jobs-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="state-image"
          />
          <h1 className="state-heading">No Jobs Found</h1>
          <p className="state-text">We could not find any jobs. Try other filters.</p>
        </div>
      )
    }

    return (
      <ul className="jobs-list">
        {jobsData.map(eachJob => (
          <JobItem key={eachJob.id} job={eachJob} />
        ))}
      </ul>
    )
  }

  const renderJobsSection = () => {
    switch (jobsStatus) {
      case apiStatus.inProgress:
        return <p className="loader-text">Loading jobs...</p>
      case apiStatus.success:
        return renderJobsList()
      case apiStatus.failure:
        return (
          <div className="failure-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
              className="state-image"
            />
            <h1 className="state-heading">Oops! Something Went Wrong</h1>
            <p className="state-text">We cannot seem to find the page you are looking for</p>
            <button type="button" className="retry-btn" onClick={getJobsData}>
              Retry
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <div className="jobs-page-container">
        <div className="filters-column">
          {renderProfileSection()}

          <hr className="separator" />

          <h1 className="filter-title">Type of Employment</h1>
          <ul className="filters-list">
            {employmentTypesList.map(eachType => (
              <li key={eachType.employmentTypeId} className="filter-item">
                <input
                  id={eachType.employmentTypeId}
                  type="checkbox"
                  className="checkbox-input"
                  onChange={() => onChangeEmploymentType(eachType.employmentTypeId)}
                />
                <label htmlFor={eachType.employmentTypeId}>{eachType.label}</label>
              </li>
            ))}
          </ul>

          <hr className="separator" />

          <h1 className="filter-title">Salary Range</h1>
          <ul className="filters-list">
            {salaryRangesList.map(eachSalary => (
              <li key={eachSalary.salaryRangeId} className="filter-item">
                <input
                  id={eachSalary.salaryRangeId}
                  type="radio"
                  name="salaryRange"
                  className="checkbox-input"
                  onChange={() => onChangeSalaryRange(eachSalary.salaryRangeId)}
                />
                <label htmlFor={eachSalary.salaryRangeId}>{eachSalary.label}</label>
              </li>
            ))}
          </ul>
        </div>

        <div className="jobs-column">
          <div className="search-box">
            <input
              type="search"
              value={searchInput}
              className="search-input"
              placeholder="Search"
              onChange={event => setSearchInput(event.target.value)}
            />
            <button
              type="button"
              className="search-btn"
              data-testid="searchButton"
              onClick={getJobsData}
            >
              Search
            </button>
          </div>

          {renderJobsSection()}
        </div>
      </div>
    </>
  )
}

export default Jobs
