// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const whichOneIsShow = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}
class CowinDashboard extends Component {
  state = {apiStatus: whichOneIsShow.initial, vaccinationData: {}}

  componentDidMount() {
    this.getVaccinationDetails()
  }

  getVaccinationDetails = async () => {
    this.setState({apiStatus: whichOneIsShow.inProgress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(each => ({
          vaccineDate: each.vaccine_date,
          dose1: each.dose_1,
          dose2: each.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age.map(eachAge => ({
          age: eachAge.age,
          count: eachAge.count,
        })),
        vaccinationByGender: data.vaccination_by_gender.map(eachGender => ({
          count: eachGender.count,
          gender: eachGender.gender,
        })),
      }
      this.setState({
        apiStatus: whichOneIsShow.success,
        vaccinationData: formattedData,
      })
    } else {
      this.setState({apiStatus: whichOneIsShow.failure})
    }
  }

  renderVaccinationList = () => {
    const {vaccinationData} = this.state
    const {vaccinationByAge, vaccinationByGender} = vaccinationData
    const {last7DaysVaccination} = vaccinationData
    return (
      <div className="success-con">
        <VaccinationCoverage last7DaysVaccination={last7DaysVaccination} />
        <VaccinationByGender vaccinationByGender={vaccinationByGender} />
        <VaccinationByAge vaccinationByAge={vaccinationByAge} />
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loading" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderVaccinationFailureView = () => (
    <div className="failure-con">
      <img
        className="failure-img"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
      />
      <h1 className="failure-text">Something Went Wrong</h1>
    </div>
  )

  renderAllItems = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case whichOneIsShow.success:
        return this.renderVaccinationList()
      case whichOneIsShow.failure:
        return this.renderVaccinationFailureView()
      case whichOneIsShow.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <div className="logo-con">
          <img
            className="logo-img"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          />
          <h1 className="logo-name">Go Win</h1>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>
        {this.renderAllItems()}
      </div>
    )
  }
}
export default CowinDashboard
