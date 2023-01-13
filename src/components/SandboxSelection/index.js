import React, { Fragment,  useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import spec from './openapi.json'

console.log(spec)

export const SandboxSelection = () => {
  const [dataSource, setDataSoure] = useState()
  const [availableEndpoints, setAvailableEndpoints] = useState([])
  const [endpoint, setEndpoint] = useState()
  const [response, setResponse] = useState()
  
  const resource = useMemo(() => {
    if (!dataSource || !endpoint) {
      return null
    }
    const method = Object.keys(spec.paths[`/${ dataSource }/${ endpoint }`][0])
    console.log(method)
    return method
  }, [dataSource, endpoint])

  const fetcher = async () => {
    const url = `https://automat.transltr.io/${ dataSource }/${ endpoint }`
    const { data } = await axios.get(url)
    if (!data) {
      throw new Error(`An error occurred while fetching data from ${ dataSource }/${ endpoint }`)
    }
    console.log(data)
  }

  const handleSelectDataSource = event => {
    setDataSoure(event.target.value)
    setEndpoint('')
  }

  const handleSelectEndpoint = event => {
    setEndpoint(event.target.value)
  }

  useEffect(() => {
    if (!dataSource) {
      return
    }
    const paths = Object.keys(spec.paths)
    const pattern = new RegExp(`\/${ dataSource }\/`, 'gi')
    setAvailableEndpoints(paths.filter(path => path.match(pattern)).map(path => path.replace(pattern, '')))
  }, [dataSource])

  return (
    <div>
      <div>
        <select
          name="data-source-select"
          id="data-source-select"
          value={ dataSource }
          onChange={ handleSelectDataSource }
        >
          <option value="">Select...</option>
          {
            spec.tags.map(({ name }) => (
              <option
                value={ name }
                key={ `data-source-option-${ name }` 
              }>{ name }</option>
            ))
          }
        </select>

        <select
          name="endpoint-select"
          id="endpoint-select"
          value={ endpoint }
          onChange={ handleSelectEndpoint }
          disabled={ !dataSource }
        >
          <option value="">Select...</option>
          {
            availableEndpoints.map(endpoint => (
              <option
                value={ endpoint }
                key={ `endpoint-option-${ endpoint }` }
                >{ endpoint }</option>
            ))
          }
        </select>
        
        <button
          onClick={ fetcher }
          disabled={ dataSource && endpoint }
        >send</button>

      </div>

      <hr />

      { resource && <pre>{ JSON.stringify(resource, null, 2) }</pre> }

      <hr />

      {
        dataSource && endpoint && (
          <div>
            extra param form fields appear...
          </div>
        )
      }


      <div className="response">
        response:
        <pre>
          { JSON.stringify(response, null, 2) }
        </pre>
      </div>
    </div>
  )
}