const { withEntitlementsPlist } = require('@expo/config-plugins');

/**
 * Add aps-environment entitlement for push notifications (development).
 * Usage in app.config.js: plugins: ["./plugins/withIosEntitlements.js"]
 */
function withIosPushEntitlement(config) {
  return withEntitlementsPlist(config, (config) => {
    config.modResults['aps-environment'] = 'development';
    return config;
  });
}

module.exports = withIosPushEntitlement;
