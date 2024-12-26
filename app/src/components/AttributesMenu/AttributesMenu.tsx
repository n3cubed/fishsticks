import { useRef, useEffect } from 'react';
import styles from './AttributesMenu.module.css';

type props = {
  position: { x: number, y: number };
  object: any;
}

export default function AttributesMenu({ position, object }: props) {
  let objectProps = useRef(object.props);

  useEffect(() => {
    objectProps.current = object.props;
  }, []);

  return (
    <div style={{ position: "absolute", left: position.x, top: position.y }} className={styles.menu}>
      <div>
        <div>Position</div>
        <span>x:</span><input onChange={ (e)=>object.setPosition({ x: Number(e.target.value), y: object.position().y }) } type="text" defaultValue={(object.position().x).toPrecision(3)} />
        <span>y:</span><input onChange={ (e)=>object.setPosition({ x: object.position().x, y: Number(e.target.value) }) } type="text" defaultValue={(object.position().y).toPrecision(3)} />
      </div>
      {objectProps.current.r && <div>
        <span>Radius:</span><input onChange={ (e)=>object.setRadius(Number(e.target.value)) } type="text" defaultValue={object.radius()} />
      </div>}
      {objectProps.current.w && objectProps.current.h && <div>
        <span>Width:</span><input  onChange={ (e)=>object.setWidth( Number(e.target.value)) }  type="text" defaultValue={object.width()} />
        <span>Height:</span><input onChange={ (e)=>object.setHeight(Number(e.target.value)) }  type="text" defaultValue={object.height()} />
      </div>}
      {<div>
        <span>Color:</span><input type="text" defaultValue={objectProps.current.color.toString(16)} />
      </div>}
      {<div>
        <span>Mass:</span><input type="text" defaultValue={objectProps.current.mass} />
      </div>}
      {<div>
        <span>Restitution:</span><input type="text" defaultValue={objectProps.current.resitution} />
      </div>}
      {<div>
        <span>Rigid body type (dynamic or fixed):</span><input type="text" defaultValue={objectProps.current.rigidBody} />
      </div>}
      {<div>
        <span>Can sleep:</span><input type="text" defaultValue={objectProps.current.canSleep} />
      </div>}
      {<div>
        <span>CCD:</span><input type="text" defaultValue={objectProps.current.ccd} />
      </div>}
      {<div>
        <span>Velocity:</span><input type="text" defaultValue={objectProps.current.velocity} />
      </div>}
    </div>
  );
}