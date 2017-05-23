/*
 * Copyright 2017 Zextras Srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global OC, OCP, $, t */

var documentsSettings = {
  appName: 'zimbradrive',

  saveUseSslValueFromCheckbox: function (event) {
    var element = $(event.srcElement);
    var elementValue = (element.attr('checked') === 'checked');
    documentsSettings.setValue('use_ssl', elementValue);
  },

  saveCheckCertsFromCheckbox: function (event) {
    var element = $(event.srcElement);
    var elementValue = (element.attr('checked') !== 'checked');
    documentsSettings.setValue('trust_invalid_certs', elementValue);
  },

  setAppValueFromInputTextElement: function (event) {
    var element = $(event.srcElement);
    var elementName = element.attr('name');
    var elementValue = element.val();
    documentsSettings.setValue(elementName, elementValue);
  },

  setAppValueFromInputNumber: function (event) {
    var element = $(event.srcElement);
    var elementName = element.attr('name');
    var elementValue = parseInt(element.val(), 10);
    documentsSettings.setValue(elementName, elementValue);
  },

  saveEnableZimbraUsersValueFromCheckbox: function (event) {
    var element = $(event.srcElement);
    var requestUrl;
    if((element.attr('checked') === 'checked'))
    {
      requestUrl = $('#url_enable_zimbra_users').attr('value');
    } else
    {
      requestUrl = $('#url_disable_zimbra_users').attr('value');
    }
    $.post(requestUrl,function(){
      documentsSettings.afterSave()
    },'json');
  },

  setValue: function (name, value){
    documentsSettings.beforeSave();
    if (typeof OCP === 'undefined') {
      OC.AppConfig.setValue( //Deprecated in NextCloud 11 but OCP.AppConfig is not supported on OwnCloud 9.1.4
        documentsSettings.appName,
        name,
        value,
        {
          success: documentsSettings.afterSave,
          error: documentsSettings.afterSave
        }
      );
    } else {
      OCP.AppConfig.setValue(
        documentsSettings.appName,
        name,
        value,
        {
          success: documentsSettings.afterSave,
          error: documentsSettings.afterSave
        }
      );
    }
  },

  beforeSave: function () {
    OC.msg.startAction('#zimbradrive-admin-msg', t(documentsSettings.appName, 'Saving...'));
  },

  afterSave: function () {
    OC.msg.finishedSuccess('#zimbradrive-admin-msg', t(documentsSettings.appName, 'Settings saved'));
  },

  updateCheckCertsCheckbox: function () {
    var use_ssl_element = $('#use_ssl');
    var check_certs_checkbox = $('#check_certs');
    if((use_ssl_element.attr('checked') === 'checked'))
    {
      check_certs_checkbox.removeAttr('disabled');
    } else
    {
      check_certs_checkbox.attr('disabled', 'disabled');
    }
  },

  saveAllowZimbraUsersLoginValueFromCheckbox: function () {
    var element = $(event.srcElement);
    var elementValue = (element.attr('checked') === 'checked');
    documentsSettings.setValue('allow_zimbra_users_login', elementValue);
  },

  initialize: function () {
    $('#zimbra_url').on('focusout', documentsSettings.setAppValueFromInputTextElement);
    $('#zimbra_port').on('focusout', documentsSettings.setAppValueFromInputNumber);

    var use_ssl_checkbox = $('#use_ssl');
    use_ssl_checkbox.on('click', documentsSettings.saveUseSslValueFromCheckbox);
    use_ssl_checkbox.on('click', documentsSettings.updateCheckCertsCheckbox);

    $('#check_certs').on('click', documentsSettings.saveCheckCertsFromCheckbox);
    $('#preauth_key').on('focusout', documentsSettings.setAppValueFromInputTextElement);
    $('#enable_zimbra_users').on('click', documentsSettings.saveEnableZimbraUsersValueFromCheckbox);
    $('#allow_zimbra_users_login').on('click', documentsSettings.saveAllowZimbraUsersLoginValueFromCheckbox);

    documentsSettings.updateCheckCertsCheckbox();
  }
};

$(document).ready(function () {
  documentsSettings.initialize();
});
