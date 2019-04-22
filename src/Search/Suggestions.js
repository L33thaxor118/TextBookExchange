/** 
@author Srilakshmi Prasad
Suggestions component to assist with displaying search results
**/
import React from 'react'

const Suggestions = (props) => {
  const options = props.results.map(r => (
    <li key={r.id}>
      {r.name}
    </li>
  ))
  return <ul>{options}</ul>
}

export default Suggestions