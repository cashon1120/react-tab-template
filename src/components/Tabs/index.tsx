import manager from './manager';
import SubTabs from './sub';
import {
  IMenu as Mclass,
  ManagerClass,
  ILayoutMenu as LayoutMenu,
} from './interface';
import menu from './menuClass';

export interface IMenu extends Mclass {}
export interface ILayoutMenu extends LayoutMenu {}
export const tabs: ManagerClass = manager;
export const Menu = menu;

interface IProps {
  data: ILayoutMenu[];
}

const Tab = (props: IProps) => {
  const { data } = props;

  return (
    <>
      {data.map((item: ILayoutMenu) => (
        <div
          key={item.path}
          id={item.path}
          style={{
            display: tabs.routes[item.path].getShowState() ? 'block' : 'none',
          }}
        >
          <div
            className="subTabContent"
            style={{
              display:
                !tabs.routes[item.path].getParentShowState() &&
                item.routes.length > 0
                  ? 'block'
                  : 'none',
            }}
          >
            <SubTabs data={item.routes || []} />
          </div>
          <div
            style={{
              display: tabs.routes[item.path].getParentShowState()
                ? 'block'
                : 'none',
            }}
          >
            {tabs.routes[item.path].getChildren()}
          </div>
        </div>
      ))}
    </>
  );
};

export default Tab;
