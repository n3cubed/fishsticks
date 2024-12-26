type props = {
  position: { x: number, y: number };
  objectProps: { [key: string]: any };
}

export default function AttributesMenu({ position, objectProps }: props) {

  return (
    <div style={{ position: "absolute", left: position.x, top: position.y }}>
      {Object.keys(objectProps).map((prop, index) => {
        return (
          <div key={index}>
            <div>{prop}</div>
            <input onChange={()=>console.log("stuff lol")} type="text" defaultValue={objectProps[prop]} />
          </div>
        )
      })}
    </div>
  );
}