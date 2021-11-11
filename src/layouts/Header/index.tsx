import { PicRightOutlined } from '@ant-design/icons';
import { RouteProps } from '../../../config/routes';
import NavItem from './NavItem'
import { tabs } from '@/layouts/Tabs';
import styles from './style.less';

type LayoutType = 'horizontal' | 'vertical'

interface IProps{
  onLayoutTypeChange: () => void
  layoutType: LayoutType
}

const Header = (props: IProps) => {
  const {onLayoutTypeChange, layoutType} = props


  return (
    <div className={`${styles.headerWrapper} ${styles[layoutType]}`}>
      <div className={styles.logo}>
        <div>标签页DEMO</div>
      </div>
      {/**导航**/}
      <nav>
        {tabs.sourceRoutes.map((route: RouteProps) =>
          route.name ? (
            <NavItem key={route.name} route={route} layoutType={layoutType} />
          ) : null,
        )}
      </nav>

       {/*右侧或底部*/}
      <div onClick={onLayoutTypeChange} className={styles.layoutChangeBtn}>
        <PicRightOutlined />布局切换
      </div>
    </div>
  );
};

export default Header;
