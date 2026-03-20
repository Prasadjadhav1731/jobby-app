import {useCallback, useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const JobItemDetails = props => {
  const {
    match: {
      params: {id},
    },
  } = props

  const [jobDetails, setJobDetails] = useState(null)
  const [similarJobs, setSimilarJobs] = useState([])
  const [status, setStatus] = useState(apiStatus.initial)

  const getJobDetails = useCallback(async () => {
    setStatus(apiStatus.inProgress)
    const jwtToken = Cookies.get('jwt_token')

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })
    const data = await response.json()

    if (response.ok) {
      const details = data.job_details
      const formattedJobDetails = {
        id: details.id,
        title: details.title,
        companyLogoUrl: details.company_logo_url,
        companyWebsiteUrl: details.company_website_url,
        employmentType: details.employment_type,
        location: details.location,
        packagePerAnnum: details.package_per_annum,
        rating: details.rating,
        jobDescription: details.job_description,
        skills: details.skills,
        lifeAtCompany: details.life_at_company,
      }

      const formattedSimilarJobs = data.similar_jobs.map(eachJob => ({
        id: eachJob.id,
        title: eachJob.title,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        location: eachJob.location,
        rating: eachJob.rating,
        jobDescription: eachJob.job_description,
      }))

      setJobDetails(formattedJobDetails)
      setSimilarJobs(formattedSimilarJobs)
      setStatus(apiStatus.success)
    } else {
      setStatus(apiStatus.failure)
    }
  }, [id])

  useEffect(() => {
    getJobDetails()
  }, [getJobDetails])

  const renderLoadingView = () => <p className="loader-text">Loading details...</p>

  const renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="state-image"
      />
      <h1 className="state-heading">Oops! Something Went Wrong</h1>
      <p className="state-text">We cannot seem to find the page you are looking for</p>
      <button type="button" className="retry-btn" onClick={getJobDetails}>
        Retry
      </button>
    </div>
  )

  const renderSuccessView = () => (
    <div className="details-card">
      <div className="job-top">
        <img
          src={jobDetails.companyLogoUrl}
          alt="job details company logo"
          className="company-logo"
        />
        <div>
          <h1 className="job-title">{jobDetails.title}</h1>
          <p className="job-rating">Rating: {jobDetails.rating}</p>
        </div>
      </div>

      <div className="job-meta">
        <p>{jobDetails.location}</p>
        <p>{jobDetails.employmentType}</p>
        <p>{jobDetails.packagePerAnnum}</p>
      </div>

      <hr className="job-separator" />

      <div className="description-row">
        <h2 className="section-title">Description</h2>
        <a
          href={jobDetails.companyWebsiteUrl}
          target="_blank"
          rel="noreferrer"
          className="visit-link"
        >
          Visit
        </a>
      </div>
      <p className="section-text">{jobDetails.jobDescription}</p>

      <h2 className="section-title">Skills</h2>
      <ul className="skills-list">
        {jobDetails.skills.map(eachSkill => (
          <li key={eachSkill.name} className="skill-item">
            <img src={eachSkill.image_url} alt={eachSkill.name} className="skill-image" />
            <p>{eachSkill.name}</p>
          </li>
        ))}
      </ul>

      <h2 className="section-title">Life at Company</h2>
      <div className="life-at-company">
        <p className="section-text">{jobDetails.lifeAtCompany.description}</p>
        <img
          src={jobDetails.lifeAtCompany.image_url}
          alt="life at company"
          className="life-image"
        />
      </div>

      <h2 className="section-title similar-title">Similar Jobs</h2>
      <ul className="similar-jobs-list">
        {similarJobs.map(eachJob => (
          <li key={eachJob.id} className="similar-job-card">
            <div className="job-top">
              <img src={eachJob.companyLogoUrl} alt="similar job company logo" className="company-logo" />
              <div>
                <h3 className="job-title">{eachJob.title}</h3>
                <p className="job-rating">Rating: {eachJob.rating}</p>
              </div>
            </div>
            <h4 className="section-title">Description</h4>
            <p className="section-text">{eachJob.jobDescription}</p>
            <div className="job-meta">
              <p>{eachJob.location}</p>
              <p>{eachJob.employmentType}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )

  const renderDetailsByStatus = () => {
    switch (status) {
      case apiStatus.inProgress:
        return renderLoadingView()
      case apiStatus.success:
        return renderSuccessView()
      case apiStatus.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <div className="details-page-container">{renderDetailsByStatus()}</div>
    </>
  )
}

export default JobItemDetails
