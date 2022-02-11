import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import NumberFormat from 'react-number-format'
import LeadsUnassignedIcon from 'src/assets/images/dashboard/leads-unasigned.svg'

import axios from 'axios'
import Skeleton from 'react-loading-skeleton'

const LeadsUnassigned = ({ filter }) => {
  const variables = useSelector((state) => state.variables)
  const access_token = useSelector((state) => state.access_token)

  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState('')

  const fetchData = React.useCallback(
    (params) => {
      setLoading(true)

      axios({
        method: 'post',
        baseURL: variables.api_base_url,
        url: 'api/cms/count-leads-not-assigned-permonth',
        headers: {
          Authorization: access_token,
        },
        params,
      }).then(
        (result) => {
          const { data } = result.data

          setData(data)
          setLoading(false)
        },
        (e) => {
          setData('-')
          setLoading(false)
        },
      )
    },
    [access_token, variables.api_base_url],
  )

  React.useEffect(() => {
    fetchData(filter)
  }, [fetchData, filter])

  if (loading) {
    return (
      <>
        <div className="card">
          <div className="card-body d-flex flex-column">
            <div className="fw-semibold text-primary mb-2">
              <Skeleton />
            </div>
            <div className="d-flex justify-content-between align-items-end mt-auto">
              <img src={LeadsUnassignedIcon} alt="Sisa Kuota" />
              <span className="h2 fw-semibold mb-0">
                <Skeleton width={100} />
              </span>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="card">
        <div className="card-body d-flex flex-column">
          <div className="fw-semibold text-primary mb-2">Leads not yet assigned</div>
          <div className="d-flex justify-content-between align-items-end mt-auto">
            <img src={LeadsUnassignedIcon} alt="Sisa Kuota" />
            <span className="h2 fw-semibold mb-0">
              <NumberFormat value={data} displayType={'text'} thousandSeparator={','} />
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

LeadsUnassigned.propTypes = { filter: PropTypes.object }

export default LeadsUnassigned