import React from 'react'

const FilterBlog = ({ sortByLike, setSortByLike, getSortedBlogs }) => {

  const handleLikeSort = ( event ) => {
    event.preventDefault()
    setSortByLike( !sortByLike )
    getSortedBlogs()
  }
  return (
    <div>
      <button onClick={ handleLikeSort } > {  sortByLike ?
        'sort by Like Asceding' :
        'sort by Like Desceding' }
      </button>
      <button>some other sort</button>
    </div>
  )
}

export default FilterBlog