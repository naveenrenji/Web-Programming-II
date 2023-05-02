import { Html, Head, Main, NextScript } from "next/document";
import Link from "next/link";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <div className="App">
          <div className="App-header">
            <h1 className="App-title">Welcome to the TicketMaster App</h1>
            <br></br>
            <br></br>{" "}
            <Link className="showlink" href="/">
              Home
            </Link>
            <Link className="showlink" href="/events/page/1">
              Events
            </Link>
            <Link className="showlink" href="/attractions/page/1">
              Attractions
            </Link>
            <Link className="showlink" href="/venues/page/1">
              Venues
            </Link>
          </div>{" "}
          <br></br>
          <br></br>
          <br></br>
          <Main />
        </div>
        <NextScript />
      </body>
    </Html>
  );
}
