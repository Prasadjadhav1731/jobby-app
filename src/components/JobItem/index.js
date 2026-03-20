import {Link} from 'react-router-dom'
import './index.css'

const JobItem = ({job}) => (
  <li className="job-card">
    <Link to={`/jobs/${job.id}`} className="job-link">
      <div className="job-top">
        <img
          src={job.companyLogoUrl}
          alt="company logo"
          className="company-logo"
        />
        <div>
          <h1 className="job-title">{job.title}</h1>
          <p className="job-rating">Rating: {job.rating}</p>
        </div>
      </div>

      <div className="job-meta">
        <p>{job.location}</p>
        <p>{job.employmentType}</p>
        <p>{job.packagePerAnnum}</p>
      </div>

      <hr className="job-separator" />

      <h2 className="description-title">Description</h2>
      <p className="description-text">{job.jobDescription}</p>
    </Link>
  </li>
)

export default JobItem