import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';

function SearchBar({ value, onChange, handleSearch, onClearSearch }) {

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    onChange(event);

    if (newValue.trim() === "") {
      onClearSearch(); 
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='flex items-center px-4 bg-slate-100 rounded-md'>
      <input 
        placeholder='Search'
        type='text'
        value={value}
        className='w-full text-xs bg-transparent py-[11px] outline-none'
        onChange={handleInputChange} 
        onKeyDown={handleKeyDown} 
      />

      {value && (
        <IoMdClose 
          className='text-xl text-slate-500 cursor-pointer hover:text-black mr-3' 
          onClick={onClearSearch} 
        />
      )}

      <FaMagnifyingGlass 
        className='text-slate-400 cursor-pointer hover:text-black' 
        onClick={handleSearch}
      />
    </div>
  );
}

export default SearchBar;