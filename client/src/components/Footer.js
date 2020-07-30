import React from "react"
import "./Footer.css"
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerContainer">
        <h3 className="footerTitle">Animesh KC</h3>
        <div className="footerRowContainer">
          <div className="footerRow">
            <a
              className="footerLink"
              href="https://github.com/AnimeshKC"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </div>
          <div className="footerRow">
            <a
              className="footerLink"
              href="https://blog.animeshkc.me/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blog
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
