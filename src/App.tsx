// Disable eslint
// eslint-disable
// import { useState } from "react";
// import { selectOne } from "css-select";
import { getCssSelector } from "css-selector-generator";
import { useEffect, useState } from "react";

function stringToHash(string: string) {
  let hash = 0;

  if (string.length == 0) return hash;

  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return hash;
}
function createHashFromHTMLELement(element: Element) {
  const string = element.outerHTML + "";
  console.log(string);
  return stringToHash(string);
}

function App() {
  // const [count, setCount] = useState(0);
  const [threads, setThreads] = useState<
    {
      selector: string;
      id: number;
      message: string;
      x: number;
      y: number;
      show: boolean;
      innerText: string | null;
      hash: number;
    }[]
  >([]);

  function checkShowProp() {
    if (!threads.length) return;
    setThreads((threads) => {
      return threads.map((thread) => {
        const element = document.querySelector(thread.selector);
        if (element) {
          if (element.textContent) {
            if (thread.innerText !== element.textContent) {
              return {
                ...thread,
                show: false,
              };
            }
          } else {
            if (createHashFromHTMLELement(element) !== thread.hash) {
              return {
                ...thread,
                show: false,
              };
            }
          }
          return {
            ...thread,
            show: true,
          };
        }
        return {
          ...thread,
          show: false,
        };
      });
    });
  }

  function listen(e: MouseEvent) {
    console.log(e);
    const target = e.target as HTMLElement;
    const selector = getCssSelector(target, {
      includeTag: true,
    });
    setThreads((threads) => {
      console.log(threads);
      return [
        ...threads,
        {
          selector,
          id: Math.random(),
          message: "tu mensaje:",
          innerText: target.textContent,
          x: e.clientX,
          y: e.clientY,
          show: true,
          hash: createHashFromHTMLELement(target),
        },
      ];
    });
  }
  useEffect(() => {
    window.addEventListener("auxclick", listen);
    const interval = setInterval(checkShowProp, 1000);
    return () => {
      window.removeEventListener("auxclick", listen);
      clearInterval(interval);
    };
  });
  return threads.map(
    (thread) =>
      thread.show && (
        <div
          style={{
            position: "absolute",
            left: thread.x,
            top: thread.y,
            backgroundColor: "white",
            padding: "1em",
            border: "1px solid black",
          }}
          key={thread.id}
        >
          <div contentEditable>{thread.message}</div>
        </div>
      )
  );
}

export default App;
