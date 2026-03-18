const { withEntitlementsPlist } = require('@expo/config-plugins');

/**
 * Add aps-environment entitlement for push notifications (development).
 * Usage in app.config: plugins: ["./plugins/withIosEntitlements"]
 */
function withIosPushEntitlement(config) {
  return withEntitlementsPlist(config, (cfg) => {
    cfg.modResults['aps-environment'] = 'development';
    return cfg;
  });
}

module.exports = withIosPushEntitlement;
