import React, { useMemo, useState } from 'react'
import Layout from '@theme/Layout'
import axios from 'axios'
import styles from './sandbox.module.css'
import { SandboxSelection } from '../components/SandboxSelection'
import spec from '../components/SandboxSelection/openapi.json'

export default function Sandbox() {
  const [source, setSource] = useState('')
  const [endpoint, setEndpoint] = useState('')

  const paths = Object.keys(spec.paths)
    .reduce((sources, path) => {
      const parts = path.split('/')
      const name = parts[1]
      return sources.includes(name) ? [...sources] : [...sources, name]
    }, [])

  const endpoints = useMemo(() => {
    if (!source) {
      return null
    }
    return Object.keys(spec.paths)
      .filter(path => path.includes(source))
  }, [source])

  const handleSelectSource = event => {
    setSource(event.target.value)
    setEndpoint('')
  }

  const handleSelectEndpoint = event => {
    setEndpoint(event.target.value)
  }

  return (
    <Layout
      title="Sandbox"
      description="Play with the API"
    >
      <main>
        <br />
        <div className="container">
          <h1 className="hero__title">API Sandbox</h1>
          <p>
            Irure fugiat minim labore duis amet ea ut consequat amet magna
            dolore fugiat quis proident dolor laboris sed. Lorem ipsum aliquip
            qui irure duis culpa laboris ullamco pariatur nulla irure amet nulla.
            Anim sunt eiusmod amet nostrud id sed culpa cupidatat qui mollit do.
          </p>

          <hr />

          <form onSubmit={ e => e.preventDefault() }>
            <select
              name="data-source-select"
              onChange={ handleSelectSource }
              value={ source }
            >
              <option value="">Select Source...</option>
              {
                paths.map(path => (
                  <option
                    key={ `source-option-${ path }`}
                    value={ path }>{ path }</option>
                ))
              }
            </select>

            <select
              name="endpoint-select"
              onChange={ handleSelectEndpoint }
              value={ endpoint }
              disabled={ !source }
            >
              <option value="">Select Endpoint...</option>
              {
                endpoints && endpoints.map(ep => (
                  <option
                    key={ `endpoint-option-${ ep }`}
                    value={ ep }>{ ep }</option>
                ))
              }
            </select>

            <button
              disabled={ !(source && endpoint) }
            >send</button>
          </form>

          {
            source && endpoint && (
              <pre>
                { JSON.stringify(spec.paths[endpoint], null, 2) }
              </pre>
            )
          }
        </div>
      </main>
    </Layout>
  );
}
