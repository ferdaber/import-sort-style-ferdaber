import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import PropTypes from "prop-types"
import React from "react"

import BrowserService from "common/services/browser-service"
import { closeMenu, openMenu } from "portals/actions/navigator-actions"
// TODO: disabled-navigator-menu
// import EditText from 'portals/containers/edit-text-container'
import { getImageDirectLinks } from "setup"
import LocalText from "common/containers/local-text-container"
import { navigatorModule as sectionProps } from "portals/store/prop-types/modules/navigator"
import { removeElement, setModuleName } from "portals/actions/module-actions"

// TODO: disabled-navigator-menu
// import CloseButton from '@widen/patterns-close-button'
// import Drawer from '@widen/patterns-drawer'
import { SecondaryButton } from "@widen/patterns-buttons"
import Toolbar from "@widen/patterns-toolbar"

// TODO: disabled-navigator-menu
// import AddIcon from 'material-design-icons/content/svg/production/ic_add_48px.svg'
import EditIcon from "material-design-icons/editor/svg/production/ic_mode_edit_24px.svg"
import DeleteIcon from "material-design-icons/action/svg/production/ic_delete_24px.svg"
// TODO: disabled-navigator-menu
// import MenuIcon from 'material-design-icons/image/svg/production/ic_dehaze_24px.svg'
import PhotoIcon from "material-design-icons/image/svg/production/ic_photo_24px.svg"

import "./navigator-section.less"

const LogoWrapper = props => {
    const buttons = [
        {
            icon: EditIcon,
            label: props.translations.edit,
            onClick: props.onEdit
        },
        {
            icon: DeleteIcon,
            label: props.translations.delete,
            onClick: props.onDelete
        }
    ]
    return (
        <div className="navigator-logo-wrapper">
            <Toolbar className="navigator-logo-toolbar" buttons={buttons} />
            <img aria-label="portal header logo" className="navigator-logo" src={props.imgSrc} />
        </div>
    )
}

// TODO: disabled-navigator-menu
// const DrawerHeader = props => {
//     const close = event => {
//         // prevent drawer header click event from triggering when closing
//         event && event.stopPropagation()
//         props.onClose()
//     }
//     return (
//         <div>
//             <EditText
//                 onChange={props.onChange}
//                 placeholder={props.placeholder}
//             >
//                 {props.title}
//             </EditText>
//             <CloseButton
//                 noEscape={false}
//                 action={close}
//             />
//         </div>
//     )
// }

export class NavigatorSection extends React.Component {
    browserService = new BrowserService(window)

    componentDidMount() {
        this.isLogoAssetDeleted && this._deleteLogo(false)
    }
    render() {
        return (
            <div className="navigator-section">
                <div className="navigator-section-workspace">
                    {this.logo && !this.isLogoAssetDeleted ? (
                        <LogoWrapper
                            imgSrc={this.logoSrc}
                            onEdit={this._editLogo}
                            onDelete={this._logoDeleteHandler}
                            translations={this.props.translations}
                        />
                    ) : (
                        <SecondaryButton
                            disabled={this.props.isSaving || this.isLogoAssetDeleted}
                            onClick={this._addLogo}
                            icon={true}
                            className="navigator-add-logo-button p-button-large"
                        >
                            {PhotoIcon} <LocalText text="add-logo" />
                        </SecondaryButton>
                    )}
                    {/* // TODO: disabled-navigator-menu
                        {this.isMenuEdited
                        ? <SecondaryButton onClick={this._toggleMenu} icon={true} className='navigator-menu-button button-unstyled'>
                            {this.props.section.name}  {MenuIcon}
                        </SecondaryButton>
                        : <SecondaryButton onClick={this._toggleMenu} icon={true} className='navigator-menu-button p-button-large'>
                            {MenuIcon}  <LocalText text='add-menu'/>
                        </SecondaryButton>
                    } */}
                </div>
                {/* // TODO: disabled-navigator-menu
                    <Drawer
                    className='navigator-drawer'
                    headerContent={
                        <DrawerHeader 
                            title={this.props.section.name}
                            onChange={this._changeName}
                            onClose={this._toggleMenu}
                            placeholder={this.props.translations.menu}
                        />
                    }
                    slideFrom='right'
                    type='fixed'
                    show={this.props.isMenuOpen}
                >
                    <div className='navigator-drawer-body'>
                        <div className='navigator-drawer-links'>
                            <SecondaryButton onClick={this._addLink} icon={true} className='navigator-add-link-button p-button-large'>
                                {AddIcon}  <LocalText text='add-link'/>
                            </SecondaryButton>
                        </div>
                        <div className='navigator-drawer-toc'>
                            <SecondaryButton onClick={this._showToc} icon={true} className='navigator-show-toc-button p-button-large'>
                                {AddIcon}  <LocalText text='add-toc'/>
                            </SecondaryButton>
                        </div>
                    </div>
                </Drawer> */}
            </div>
        )
    }

    get isMenuEdited() {
        const section = this.props.section
        return (
            section &&
            ((section.elements && section.elements.filter(e => e.type !== "Image").length) ||
                (section.data && !section.data.isTocHidden))
        )
    }

    get isLogoAssetDeleted() {
        return this.logo && !this.logo.image_asset
    }

    get logo() {
        return (this.props.section.elements && this.props.section.elements.find(e => e.type === "Image")) || null
    }

    get logoSrc() {
        return !this.logo || this.isLogoAssetDeleted
            ? ""
            : getImageDirectLinks({
                  asset: this.logo.image_asset,
                  customerName: this.props.customerName,
                  embedPresets: [
                      {
                          height: 48,
                          retina: this.browserService.isRetinaDisplay
                      }
                  ]
              })[0].uri
    }

    // TODO: disabled-navigator-menu
    _addLink = () => console.log("I'm adding an external link!")

    _addLogo = () => this.props.onAddLogo()

    _changeName = newName => {
        this.props.actions.setModuleName(this.props.section.id, newName)
    }

    _editLogo = () => this.props.onEditLogo()

    _deleteLogo = (isUndoable = true) =>
        this.props.actions.removeElement(this.props.section.id, this.logo.id, isUndoable)

    _logoDeleteHandler = () => this._deleteLogo()

    // TODO: disabled-navigator-menu
    _showToc = () => console.log("I'm unhiding the table of contents!")

    _toggleMenu = () => (this.props.isMenuOpen ? this.props.actions.closeMenu() : this.props.actions.openMenu())
}

NavigatorSection.propTypes = {
    actions: PropTypes.shape({
        closeMenu: PropTypes.func,
        openMenu: PropTypes.func,
        removeElement: PropTypes.func,
        setModuleName: PropTypes.func
    }),
    customerName: PropTypes.string,
    isMenuOpen: PropTypes.bool,
    isSaving: PropTypes.bool,
    onAddLogo: PropTypes.func,
    onEditLogo: PropTypes.func,
    section: PropTypes.shape(sectionProps).isRequired,
    translations: PropTypes.object
}

NavigatorSection.defaultProps = {
    translations: {
        menu: "Menu",
        edit: "Edit",
        delete: "Delete"
    }
}

const mapStateToProps = state => ({
    customerName: state.app.customerName,
    isMenuOpen: state.navigator.isMenuOpen,
    isSaving: state.modules.isSaving,
    section: state.modules.items.find(module => module.type === "Navigator") || {},
    translations: state.localText.translations
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            closeMenu,
            openMenu,
            removeElement,
            setModuleName
        },
        dispatch
    )
})

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorSection)
