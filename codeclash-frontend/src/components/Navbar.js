import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <Link to={"/"} style={{textDecoration:"none",fontSize:"3rem",color:"white"}}>&lt;Code/Clash&gt;</Link>
      <div style={styles.links}>
        {/* <Link to="/add-question" style={styles.link}>Add Question</Link> */}
        {/* <Link to="/delete" style={styles.link}>Delete Question</Link> */}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1e1e2f',
    color: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    gap: '1rem'
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    backgroundColor: '#2e2e3e',
    transition: '0.3s',
  }
};

export default Navbar;
